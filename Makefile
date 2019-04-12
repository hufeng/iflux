build: clean
	npx tsc --project ./packages/iflux
	@echo "build successfully 👨‍❤️‍👨"

clean:
	rm -rf ./packages/iflux/lib
	@echo "clean successfully 💖 \n"