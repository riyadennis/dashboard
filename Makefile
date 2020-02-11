docker-build:
	docker build -t riyadennis/dashboard .

docker-run:
	docker run -v ${PWD}:/dashboard -v /dashboard/node_modules -p 3001:3000 --rm riyadennis/dashboard:latest
#	docker run --rm -p 3000:3000  --name dashboard riyadennis/dashboard:latest

docker-push:
	docker push riyadennis/dashboard:latest