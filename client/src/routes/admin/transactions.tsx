import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import Layout from '../../components/layout/Layout';
import { appStore } from '../../store/appStore';

// Define Transaction interface
interface Transaction {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  orderNumber: number;
  timestamp: string;
}

export const Route = createFileRoute('/admin/transactions')({
  component: TransactionsPage,
  beforeLoad: () => {
    // Check if user is authenticated and is admin
    const isAuthenticated = appStore.state.isAuthenticated;
    const token = localStorage.getItem('adminToken');

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
    else if(!token) {
      throw redirect({
        to: '/'
      });
    }
  },
});

const URL = import.meta.env.VITE_DATABASE_URL;

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`https://${URL}/api/transactions/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    event; // add this to bypass build error
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transaction History
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper
            component={motion.div}
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            elevation={3}
            sx={{ width: '100%', overflow: 'hidden' }}
          >
            {transactions.length > 0 ? (
              <>
                <TableContainer sx={{ height: '600px' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((transaction) => (
                          <TableRow key={transaction._id} hover>
                            <TableCell>
                              <Chip 
                                label={`#${transaction.orderNumber}`} 
                                color="primary" 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              {transaction.userId ? 
                                `${transaction.userId.firstName} ${transaction.userId.lastName}` : 
                                'Unknown User'}
                            </TableCell>
                            <TableCell>
                              {transaction.userId ? transaction.userId.email : 'N/A'}
                            </TableCell>
                            <TableCell align="right">
                              <Typography 
                                variant="body1" 
                                sx={{ fontWeight: 'bold', color: 'success.main' }}
                              >
                                ${transaction.amount.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={transactions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No transactions found.
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Layout>
  );
}
