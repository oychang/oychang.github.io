POSTS    = posts
HELPERS  = helpers
CSS      = css

GENERATE = pandoc \
                --smart \
                --highlight-style pygments \
                --standalone \
                --template templates/post.html

# https://tylercipriani.com/2014/05/13/replace-jekyll-with-pandoc-makefile.html
all: $(addsuffix .html, $(basename $(wildcard $(POSTS)/*.md))) index.html

index.html:
	@echo "================"
	@echo "Refreshing Index"
	@echo "================"

%.html: %.md
	$(GENERATE) "$<" -o "$@"

css/github-markdown.css:
	curl https://raw.githubusercontent.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css > css/github-markdown.css

.PHONY: clean
clean:
	rm -f $(POSTS)/*.html
