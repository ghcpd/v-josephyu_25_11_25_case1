# run_tests.ps1 - Run tests on Windows PowerShell
Write-Host "Running README example test"
npm run test:readme
Write-Host "Running all feature tests"
npm run test:all
Write-Host "All tests finished."
