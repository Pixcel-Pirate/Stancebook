Unicode true
!include "MUI2.nsh"
!ifndef VERSION
  !define VERSION "dev"
!endif
!ifndef VNUM
  !define VNUM "0.0.0.0"
!endif
VIProductVersion "${VNUM}"
VIAddVersionKey "ProductName" "Stancebook"
VIAddVersionKey "CompanyName" "pixcel"
VIAddVersionKey "FileDescription" "Stancebook installer"
VIAddVersionKey "FileVersion" "${VNUM}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "LegalCopyright" "pixcel"
Name "Stancebook"
OutFile "Stancebook-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\Stancebook"
RequestExecutionLevel user
SetCompressor zlib
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_FINISHPAGE_RUN "$INSTDIR\Stancebook.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Open Stancebook"
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

!define UNINST "Software\Microsoft\Windows\CurrentVersion\Uninstall\Stancebook"
!define WV2 "{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"

Section "Install"
  ; Always the same folder, so a new version replaces the old one in place.
  ; Windows won't let us replace the app while it's open, so ask the user to close it.
  retry:
  ClearErrors
  IfFileExists "$INSTDIR\Stancebook.exe" 0 copy
  Delete "$INSTDIR\Stancebook.exe"
  IfErrors 0 copy
  MessageBox MB_RETRYCANCEL "Stancebook is still open. Close it, then click Retry." IDRETRY retry IDCANCEL quit
  quit:
  Abort
  copy:
  SetOutPath "$INSTDIR"
  File "Stancebook.exe"
  File "resources.neu"
  File "icon.ico"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateShortcut "$DESKTOP\Stancebook.lnk" "$INSTDIR\Stancebook.exe" "" "$INSTDIR\icon.ico"
  CreateShortcut "$SMPROGRAMS\Stancebook.lnk" "$INSTDIR\Stancebook.exe" "" "$INSTDIR\icon.ico"
  WriteRegStr HKCU "${UNINST}" "DisplayName" "Stancebook"
  WriteRegStr HKCU "${UNINST}" "DisplayIcon" "$INSTDIR\icon.ico"
  WriteRegStr HKCU "${UNINST}" "Publisher" "pixcel"
  WriteRegStr HKCU "${UNINST}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINST}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINST}" "UninstallString" '"$INSTDIR\Uninstall.exe"'

  ; The app draws with Microsoft Edge WebView2 (built into Windows 11 and up-to-date Windows 10).
  ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\${WV2}" "pv"
  StrCmp $0 "" 0 done
  ReadRegStr $0 HKCU "Software\Microsoft\EdgeUpdate\Clients\${WV2}" "pv"
  StrCmp $0 "" 0 done
  MessageBox MB_OK "Stancebook needs Microsoft Edge WebView2, which isn't on this PC yet. Get it from Microsoft: search for $\"WebView2 Runtime$\" or go to go.microsoft.com/fwlink/p/?LinkId=2124703"
  done:
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\Stancebook.lnk"
  Delete "$SMPROGRAMS\Stancebook.lnk"
  ; only our own files, so a misplaced Uninstall.exe can't wipe a whole folder
  Delete "$INSTDIR\Stancebook.exe"
  Delete "$INSTDIR\resources.neu"
  Delete "$INSTDIR\icon.ico"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR\.tmp"
  RMDir /r "$INSTDIR\.storage"
  RMDir "$INSTDIR"
  DeleteRegKey HKCU "${UNINST}"
SectionEnd
