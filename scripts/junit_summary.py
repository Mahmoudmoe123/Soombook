#!/usr/bin/env python3
"""Turn a JUnit XML test report into a short Markdown summary.

GitHub Actions shows anything written to $GITHUB_STEP_SUMMARY on the run's page:

    python scripts/junit_summary.py reports/api.xml >> "$GITHUB_STEP_SUMMARY"

Works with the reports pytest writes with --junitxml. Uses only the standard library.
"""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def summarize(report_path):
    path = Path(report_path)
    if not path.exists():
        return f"### Test report\n\nNo report at `{path}`; the tests did not run.\n"

    root = ET.parse(path).getroot()
    suites = [root] if root.tag == "testsuite" else root.findall("testsuite")
    total = failed = errors = skipped = 0
    seconds = 0.0
    problems = []
    for suite in suites:
        total += int(suite.get("tests", 0))
        failed += int(suite.get("failures", 0))
        errors += int(suite.get("errors", 0))
        skipped += int(suite.get("skipped", 0))
        seconds += float(suite.get("time", 0))
        for case in suite.iter("testcase"):
            for kind in ("failure", "error"):
                problem = case.find(kind)
                if problem is not None:
                    lines = (problem.get("message") or "").splitlines()
                    message = (lines[0] if lines else "")[:200].replace("|", "\\|")
                    problems.append(f"| `{case.get('classname')}.{case.get('name')}` | {kind} | {message} |")

    passed = total - failed - errors - skipped
    verdict = "All tests passed" if failed == errors == 0 else f"{failed + errors} test(s) failed"
    lines = [
        f"### {verdict}",
        "",
        "| Passed | Failed | Errors | Skipped | Time |",
        "| --- | --- | --- | --- | --- |",
        f"| {passed} | {failed} | {errors} | {skipped} | {seconds:.1f}s |",
    ]
    if problems:
        lines += ["", "| Test | Result | Message |", "| --- | --- | --- |", *problems]
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: junit_summary.py <report.xml>")
    print(summarize(sys.argv[1]))
