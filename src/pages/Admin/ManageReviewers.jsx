import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip,
  Dialog, DialogTitle, DialogContent, FormControl,
  InputLabel, Select, MenuItem, DialogActions, TextField,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const ManageReviewers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [reason, setReason] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      if (data.success) {
        // Filter for Reviewers
        const reviewers = data.users.filter(u => u.role === 'reviewer');
        setUsers(reviewers);
      }
    } catch (error) {
      toast.error("Failed to load reviewers");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setNewRole(user.role || 'reviewer');
    setReason('');
    setDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!editUser) return;
    try {
      await adminService.updateUserRole(editUser.id, newRole, reason);
      toast.success(`User role updated to ${newRole}`);
      setDialogOpen(false);
      fetchUsers(); // Refresh list
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3, bgcolor: '#1A2E40', borderRadius: 2, minHeight: '80vh' }}>
      <Typography variant="h5" sx={{ mb: 3, color: '#64CCC5', fontWeight: 'bold' }}>
        Manage Reviewers
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: '#2B3E50' }}>
        <Table sx={{ minWidth: 650 }} aria-label="reviewers table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#ccc' }}>Name</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Email</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Role</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Institution</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Joined</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
              >
                <TableCell component="th" scope="row" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label="Reviewer"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{user.institution || '-'}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: '#64CCC5', borderColor: '#64CCC5', mr: 1, '&:hover': { bgcolor: 'rgba(100,204,197,0.1)' } }}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ color: 'white', textAlign: 'center', py: 3 }}>
                  No reviewers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Role Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit User Role for {editUser?.name}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MenuItem value="researcher">Researcher</MenuItem>
                <MenuItem value="reviewer">Reviewer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Reason for change"
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Promoted to admin"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ManageReviewers;