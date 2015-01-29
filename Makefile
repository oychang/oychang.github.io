POSTS    = posts
CSS      = css

GENERATE = pandoc \
                --smart \
                --highlight-style pygments \
                --standalone \
                --template templates/post.html

# https://tylercipriani.com/2014/05/13/replace-jekyll-with-pandoc-makefile.html
all: $(addsuffix .html, $(basename $(wildcard $(POSTS)/*.md)))

%.html: %.md
	$(GENERATE) "$<" -o "$@"

.PHONY: clean
clean:
	rm -f $(POSTS)/*.html
