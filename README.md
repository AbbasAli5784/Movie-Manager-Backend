# Movie Manager

A modern web app for managing your favorite movies.  
Built with Node.js, Express, MongoDB (Mongoose), and Pug.  
Features user authentication, movie CRUD, and a creative, responsive UI.

---

## Features

- User registration and login
- Session-based authentication
- Add, edit, delete, and view movies
- Only logged-in users can manage movies
- Only movie owners can edit or delete their movies
- User profile page
- Modern, creative UI with responsive movie cards

---

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/movie-manager-backend.git
cd movie-manager-backend
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the app
```sh
npm run dev
```
or
```sh
npm start
```

Visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## Deployment

You can deploy this app to Heroku, Render, or any Node.js-friendly cloud platform.

**Heroku Example:**
1. Push your code to a GitHub repository.
2. Create a Heroku app and connect your repository.
3. Set the `MONGO_URI` config variable in the Heroku dashboard.
4. Deploy.

---

## Project Structure

```
Movie-Manager-Backend/
│
├── index.js
├── package.json
├── .env
├── src/
│   └── routes/
│       ├── middleware/
│       │   └── requireLogin.js
│       ├── models/
│       │   └── User.js
│       ├── views/
│       │   ├── addMovie.pug
│       │   ├── editMovie.pug
│       │   ├── index.pug
│       │   ├── layout.pug
│       │   ├── login.pug
│       │   ├── me.pug
│       │   ├── movie.pug
│       │   └── register.pug
│       ├── auth.js
│       └── movies.js
```

---

## Credits

- UI inspired by modern streaming platforms
- Built with Express, Mongoose, and Pug

---

## License

MIT

---

