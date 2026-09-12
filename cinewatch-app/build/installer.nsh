!macro customInit
  ; Accurately set the displayed space required to 107 MB (in KB: 107 * 1024 = 109568)
  SectionSetSize ${INSTALL_SECTION_ID} 109568
!macroend
