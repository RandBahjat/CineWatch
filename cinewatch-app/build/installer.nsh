!macro customHeader
  LangString chooseInstallationOptions ${LANG_ENGLISH} "CineWatch Setup Options"
  LangString whoShouldThisApplicationBeInstalledFor ${LANG_ENGLISH} "Select your installation preference"
  LangString selectUserMode ${LANG_ENGLISH} "Choose how you would like to set up CineWatch on this PC:"
  LangString onlyForMe ${LANG_ENGLISH} "Install for Current User (Recommended - Fast & No Administrator permissions needed)"
  LangString forAll ${LANG_ENGLISH} "Install for All User Accounts (System-wide - Requires Administrator)"
!macroend

!macro customInit
  ; Override the displayed required space to accurately show 107 MB instead of 285 MB
  SectionSetSize ${INSTALL_SECTION_ID} 109568
!macroend
