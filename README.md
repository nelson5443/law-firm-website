# Law Firm Website

A modern, professional law firm website with contact management, admin panel, and email integration.

## Features

- Professional law firm homepage
- Contact form with email notifications
- Admin panel for managing inquiries
- Real-time chat functionality
- Database integration with Supabase
- Email service integration with Resend

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Email Service**: Resend
- **Authentication**: Supabase Auth

## Project Structure

```
law-firm-website/
├── css/
│   └── style.css          # Main stylesheet
├── images/                # Image assets
├── js/
│   ├── server/           # Server-side JavaScript modules
│   └── script.js         # Client-side JavaScript
├── pages/
│   ├── admin.html        # Admin panel
│   └── contact.html      # Contact page
├── .env                  # Environment variables
├── database-setup.sql    # Database schema
├── index.html           # Homepage
├── package.json         # Dependencies
└── server.js           # Main server file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Resend account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd law-firm-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email@domain.com
```

5. Set up the database:
```bash
# Run the SQL commands in database-setup.sql in your Supabase dashboard
```

6. Start the development server:
```bash
npm start
```

The website will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `RESEND_API_KEY` | Resend API key for email service | Yes |
| `EMAIL_FROM` | From email address | Yes |

## API Endpoints

- `GET /` - Homepage
- `GET /pages/contact.html` - Contact page
- `GET /pages/admin.html` - Admin panel
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin)
- `POST /api/chat` - Chat functionality

## Database Schema

The application uses the following main tables:
- `contacts` - Store contact form submissions
- `chat_messages` - Store chat messages
- `users` - User authentication (Supabase Auth)

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.