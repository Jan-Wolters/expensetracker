import React from 'react';
import "./style/dashboard.scss"

export const Dashboard: React.FC = () => {
  return (
    <>
      <header>
        <h1>My Wallet</h1>
      </header>

      <main>
        <section className="balance">
          <h2>Balance</h2>
          <p>$500.00</p>
        </section>

        <section className="transactions">
          <h2>Recent Transactions</h2>
          <ul>
            <li>Received $100.00 from John Doe</li>
            <li>Sent $50.00 to Jane Smith</li>
            <li>Received $300.00 from ABC Inc.</li>
            {/* Add more transactions here */}
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} My Wallet</p>
      </footer>
    </>
  );
};
