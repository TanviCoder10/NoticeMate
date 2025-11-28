📢 Notice Board Web Application
-------------------------------------------------------------------------------------------------------------------
A simple, user-friendly web-based Notice Board system where administrators can create, edit, and remove notices, while users can view current and past notices.
Old notices are automatically removed based on date, ensuring the board always stays updated.

Built using:

EJS – Frontend templating

Node.js + Express – Backend server

MongoDB – Database for storing notices

-------------------------------------------------------------------------------------------------------------------
🌐 Live Demo
-------------------------------------------------------------------------------------------------------------------
🚀 Hosted Version:
👉 

-------------------------------------------------------------------------------------------------------------------
📌 Features
-------------------------------------------------------------------------------------------------------------------
✅ Admin Features

➕ Add new notices

✏️ Edit existing notices

🗑️ Delete notices manually

📅 Automatic removal of expired notices by date

-------------------------------------------------------------------------------------------------------------------
👀 User Features
-------------------------------------------------------------------------------------------------------------------
📄 View active (current) notices

📚 View past notices (if enabled)

📱 Responsive user interface

-------------------------------------------------------------------------------------------------------------------
🛠️ Tech Stack
-------------------------------------------------------------------------------------------------------------------
Layer	Technology
Frontend	EJS, CSS, Bootstrap/Tailwind (optional)
Backend	Node.js, Express.js
Database	MongoDB / Mongoose
Deployment	Render / Railway / Vercel / Localhost

-------------------------------------------------------------------------------------------------------------------
⚙️ Installation & Setup
-------------------------------------------------------------------------------------------------------------------
1️⃣ Clone the Repository
git clone https://github.com/your-username/notice-board.git
cd notice-board

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file:

PORT=5000
MONGO_URI=mongodb+srv://your-cluster-url
SESSION_SECRET=your-secret-key

4️⃣ Start the Application
npm start

5️⃣ Open in Browser
http://localhost:5000

-------------------------------------------------------------------------------------------------------------------
🗄️ Database Schema (Mongoose)
-------------------------------------------------------------------------------------------------------------------
db.users.find()
[
  {
    username: 'admin',
    role: 'admin',
    createdAt: ISODate('2025-10-28T13:37:40.103Z'),
    passwordHash: 'password',
    __v: 0
  },
  {
    username: 'student01',
    role: 'student',
    createdAt: ISODate('2025-10-28T13:37:40.232Z'),
    passwordHash: 'password',
    __v: 0
  }
]
 db.notices.find()
[
  {
    title: 'Assignment Submission',
    category: 'Academic',
    description: 'Submit Assignment 3 by 10/5/2025',
    expiry: ISODate('2025-10-30T00:00:00.000Z'),
    createdAt: ISODate('2025-10-28T14:25:23.756Z'),
    __v: 0
  }
]

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

📄 License

Open-source — free to use for learning and development.
