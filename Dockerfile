# Use an offficial Nginx runtime as a parent image
FROM nginx:1.21-alpine

# Copy the HTML, CSS and Javascript files into the container
COPY src/ /usr/share/nginx/html/

# Expose port 80 for the nginx server
EXPOSE 80

# Start nginx server when the container starts
CMD [ "nginx", "-g", "daemon off;" ]