# IT.GUY Platform

![IT.GUY Logo](https://i.pinimg.com/originals/73/c9/f8/73c9f8f4c8f51c1144d551d9fdd42a23.gif)

A comprehensive platform connecting clients with tech support services, offering both on-site and in-shop hardware repairs.

## Overview

IT.GUY is a user-friendly web application designed to streamline the process of scheduling technical support and hardware repair services. The platform allows clients to submit detailed information about their technical issues, choose between on-site visits or device drop-offs, and track the status of their repairs in real-time.

## Features

### Client Features

- **Account Management**

  - Create and verify user accounts
  - Update account information (location, username, email)
  - Account deletion with reason tracking
  - Cancel pending account deletion

- **Service Scheduling**

  - Create detailed support tickets with issue categorization
  - Flexible scheduling options:
    - On-site technical support with date selection
    - Device drop-off scheduling
    - IT.GUY delivery service scheduling

- **Repair Tracking**

  - View repair history
  - Monitor ongoing repair status with real-time updates
  - Receive notifications on repair progress

- **Payment Options**
  - Cash on delivery
  - Direct bank transfer

### Admin/Technician Features

- **Ticket Management**

  - Review and process incoming support requests
  - Assign technicians based on expertise and availability
  - Schedule management with conflict resolution

- **Service Execution**
  - Update repair status in real-time
  - Document repair notes and actions taken
  - Upload before/after images of repairs

## Technical Specifications

### Architecture

- **Frontend**: React.js (19) with responsive design
- **Backend**: Node.js/Express.js
- **Database**: MongoDB for flexible document storage
- **Authentication**: JWT with email verification
- **Payment Gateway**: MidTrans (TEST MODE)

### Database Schema

#### User Model

```javascript
{
  userId: String,
  username: String,
  email: String,
  password: String (hashed),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: String,
  verified: Boolean,
  createdAt: Date,
  deletionRequested: Boolean,
  deletionReason: String,
  deletionDate: Date
}
```

#### Service Request Model

```javascript
{
  requestId: String,
  userId: String,
  category: String,
  subject: String,
  description: String,
  serviceType: ["on-site", "drop-off", "delivery"],
  scheduleDate: Date,
  deliveryOption: String,
  paymentMethod: String,
  status: String,
  assignedTechnician: String,
  notes: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Installation and Setup

### Prerequisites

- Node.js v14+
- MongoDB
- npm or pnpm

### Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/Rayyks/it.guy.git
cd it.guy
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

## Deployment

The application is designed to be deployed on various platforms:

- **Vercel**: For the frontend
- **AWS/DigitalOcean**: For more advanced scaling options
- **Docker**: Containerized deployment for consistent environments

## Future Enhancements

- Verified account functionality
- Real-time chat with technicians
- Spare parts inventory and sales
- Knowledge base for common technical issues
- Mobile application for on-the-go service management
- Integration with popular calendar applications

## Contributing

We welcome contributions to improve the IT.GUY platform. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:

- Email: rayydna14@gmail.com
- Website: coming soon!!!

---

_This platform was developed as a final project for securing employment in the IT industry._
