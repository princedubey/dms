// src/app/layout.js
import './globals.css';
import Navbar from './components/Navbar';
export const metadata = {
  title: 'CSV Upload and Customer Management',
  description: 'Upload CSV files to S3 and manage customer data',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-2">
          {children}
        </main>
      </body>
    </html>
  );
}
