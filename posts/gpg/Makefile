MD_FILE=notes-on-yubikey-neo.md
CSS_FILE=styles.html

$(MD_FILE:.md=.html): $(MD_FILE) $(CSS_FILE)
	pandoc -o $@ --standalone -H $(CSS_FILE) $<
