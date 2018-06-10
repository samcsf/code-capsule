build-frontend: clear
	cd ./frontend; npm run build
	mv ./frontend/dist ./public

build: build-frontend
	docker build -t samfcs/code-capsule .

clear:
	rm -rf ./public
	rm -rf ./frontend/dist

PHONY: build, clear