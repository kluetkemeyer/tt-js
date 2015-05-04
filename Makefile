
BIN						=	./bin
BUILD					=	./build
HTML_COMPRESSOR			=	java -jar $(BIN)/htmlcompressor.jar
HTML_COMPRESSOR_ARGS		=	

CLOSURE_FLAGS			= --compilation_level=ADVANCED_OPTIMIZATIONS
#CLOSURE_FLAGS			=


.PHONY:					build-prepare build-prepare-folder build-html \
						build-javascript build-prepare-js build clean \
						all debug debug-javascript debug-prepare-js \
						debug-html

all:					debug build

build:					build-prepare build-html build-javascript $(BUILD)/.htaccess

debug:					build-prepare debug-html debug-javascript $(BUILD)/.htaccess

build-prepare:			build-prepare-folder

build-prepare-folder:
	mkdir -p "$(BUILD)"
	mkdir -p "$(BUILD)/static"

build-prepare-js:		build-prepare-folder

debug-prepare-js:		build-prepare-folder \
						"$(BUILD)/debug/js/closure" \
						"$(BUILD)/debug/js/closure-external" \
						"$(BUILD)/debug/js/app"
						
build-javascript:		build-prepare-js "$(BUILD)/static/app.js" 

debug-javascript:		debug-prepare-js "$(BUILD)/debug/js/deps.js"

"$(BUILD)/debug":		
	mkdir -p $@
	
"$(BUILD)/debug/js":	"$(BUILD)/debug"
	mkdir -p $@
	
"$(BUILD)/debug/js/closure":	\
						"$(BUILD)/debug/js"
	test -d $@ || ln -s "$$(pwd)/libs/js/closure" $@
	
"$(BUILD)/debug/js/closure-external":	\
						"$(BUILD)/debug/js"
	test -d $@ || ln -s "$$(pwd)/libs/js/closure-external" $@
	
"$(BUILD)/debug/js/app":			\
						"$(BUILD)/debug/js"
	test -d $@ || ln -s "$$(pwd)/src/js" $@

build-html:				build-prepare build/index.html 

debug-html:				build-prepare build/debug.html

clean:
	rm -rf "$(BUILD)"
	
# .htaccess
$(BUILD)/.htaccess:		src/config/.htaccess
	cp "$<" "$@"

# index.html
$(BUILD)/index.html:		src/html/index.html
	$(HTML_COMPRESSOR) $(HTML_COMPRESSOR_ARGS) -o "$@" "$<"

# debug.html
$(BUILD)/debug.html:		src/html/debug.html
	$(HTML_COMPRESSOR) $(HTML_COMPRESSOR_ARGS) -o "$@" "$<"
	
# static/app.js
"$(BUILD)/static/app.js":	
#	$(BIN)/closure/build/closurebuilder.py \
#		--root=libs/js/closure/ \
#		--root=libs/js/closure-external/ \
#		--root=src/js/ \
#		--namespace="ttapp.main" \
#		--output_mode=compiled \
#		--compiler_jar="$(BIN)/closurecompiler.jar" \
#		--compiler_flags="$(CLOSURE_FLAGS)" \
#		> $@
	java -jar $(BIN)/closurecompiler.jar \
		--closure_entry_point "ttapp.main" \
		--js="libs/js/**.js" \
		--js="!libs/js/**_test.js" \
		--js="src/js/**.js" \
		--js="!src/js/**_test.js" \
		--only_closure_dependencies \
		--generate_exports \
		--compilation_level=ADVANCED \
		> $@

# debug/js/deps.js
"$(BUILD)/debug/js/deps.js":
	$(BIN)/closure/build/depswriter.py \
		--root_with_prefix="libs/js/ ../../../../debug/js/" \
		--root_with_prefix="src/js/ ../../../../debug/js/app/" \
		> $@
	
