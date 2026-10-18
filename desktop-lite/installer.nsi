Unicode true
!include "MUI2.nsh"
!ifndef VERSION
  !define VERSION "dev"
!endif
Name "Stancebook"
OutFile "Stancebook-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\Stancebook"
RequestExecutionLevel user
SetCompressor /SOLID lzma
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_FINISHPAGE_RUN "$INSTDIR\Stancebook.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Open Stancebook"
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

!define UNINST "Software\Microsoft\Windows\CurrentVersion\Uninstall\Stancebook"
!define WV2 "{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"

Section "Install"
  ; Always the same folder, so a new version replaces the old one in place.
  ; Close a running copy first, otherwise Windows won't let us overwrite it.
  nsExec::Exec 'taskkill /F /IM Stancebook.exe'
  Pop $0
  Sleep 500
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
  MessageBox MB_YESNO "Stancebook needs Microsoft Edge WebView2, which isn't on this PC yet. Open Microsoft's download page now?" IDNO done
  ExecShell "open" "https://go.microsoft.com/fwlink/p/?LinkId=2124703"
  done:
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\Stancebook.lnk"
  Delete "$SMPROGRAMS\Stancebook.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "${UNINST}"
SectionEnd
