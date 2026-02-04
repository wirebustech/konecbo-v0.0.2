import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip,
    CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllReviews();
            if (data.success) {
                setReviews(data.reviews || []);
            }
        } catch (error) {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3, bgcolor: '#1A2E40', borderRadius: 2, minHeight: '80vh' }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#64CCC5', fontWeight: 'bold' }}>
                Manage Reviews
            </Typography>

            <TableContainer component={Paper} sx={{ bgcolor: '#2B3E50' }}>
                <Table sx={{ minWidth: 650 }} aria-label="reviews table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#ccc' }}>Project</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Reviewer</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Rating</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Comments</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Status</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow
                                key={review.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                            >
                                <TableCell component="th" scope="row" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {review.listing_title || 'Unknown Project'}
                                </TableCell>
                                <TableCell sx={{ color: 'white' }}>
                                    <Typography variant="body2">{review.reviewer_name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#aaa' }}>{review.reviewer_email}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    {review.rating} / 5
                                </TableCell>
                                <TableCell sx={{ color: 'white', maxWidth: 300 }}>
                                    <Typography noWrap variant="body2" title={review.comments}>
                                        {review.comments}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={review.status}
                                        size="small"
                                        color={getStatusColor(review.status)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell sx={{ color: 'white' }}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {reviews.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ color: 'white', textAlign: 'center', py: 3 }}>
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ManageReviews;
