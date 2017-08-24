ifeq ($(findstring dev,$(MAKECMDGOALS)),)
PROD_FLAG = -p
endif

ifeq ($(findstring demo,$(MAKECMDGOALS)),)
BUILD_TYPE = prod
else
BUILD_TYPE = demo
endif

TARGET = "*"
export PATH := ./node_modules/.bin:${PATH}

package: build _package

build: _clean _build

clean: _clean

serve: _serve

test: _test

deps: _deps

stats: _stats

# Empty "variable setting" targets
dev: ;
demo: ;

# Real commands
_clean:
	rm -rf ./dist
	rm -rf ./package

_deps:
	yarn install

_serve: _deps
_serve:
	WEBPACK_BUNDLE=$(TARGET) webpack-dev-server --progress --inline ${PUBLIC}

_test: _deps
_test:
	mocha --opts mocha.opts

_build: _deps
	WEBPACK_BUNDLE=$(TARGET) BUILD_TYPE=$(BUILD_TYPE) webpack --progress --profile $(PROD_FLAG)

_package: _deps
	mkdir package
	cd package; npm pack ../

_version: _deps
	yarn version

_stats:
	WEBPACK_BUNDLE=$(TARGET) BUILD_TYPE=$(BUILD_TYPE) webpack  $(PROD_FLAG) --json > stats.json

