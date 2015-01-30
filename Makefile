POSTS      = posts
# Use this instead of a more make-ish pattern
# to easily include subdirectories of $(POSTS)
MD_FILES   = $(shell find $(POSTS) -type f -name '*.md')
HTML_FILES = $(MD_FILES:.md=.html)
GENERATE   = pandoc \
                --smart \
                --highlight-style pygments \
                --standalone \
                --template templates/post.html


all: $(HTML_FILES)
%.html: %.md
	$(GENERATE) "$<" -o "$@"


.PHONY: clean
# Specify -type f to avoid deleting manually creating
# symlinks.
clean:
	find $(POSTS) -type f -name '*.html' -delete
