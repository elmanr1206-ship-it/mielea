# Usamos Nginx Alpine porque es ligerísimo (como 5MB), nada de bloatware
FROM nginx:alpine

# Esto es clave: Copiamos TODO lo que hay en tu carpeta actual
# (el index.html, la carpeta css, la carpeta js, assets, etc.)
# y lo metemos en la carpeta pública del servidor Nginx dentro del contenedor.
COPY . /usr/share/nginx/html

# Le decimos al mundo que este contenedor va a escuchar por el puerto 80 (el estándar web)
EXPOSE 80