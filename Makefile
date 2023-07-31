build:
	docker build -t google-sheets:1.0.0 .

run:
	docker run -d --rm -it --name google-sheets -p 5000:80 google-sheets:1.0.0