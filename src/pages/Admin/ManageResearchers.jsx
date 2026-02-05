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

const ManageResearchers = () => {
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
        setUsers(data.users);
      }
    } catch (error) {
      toast.error("Failed to load researchers");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setNewRole(user.role || 'researcher');
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

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [userToUnsuspend, setUserToUnsuspend] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [unsuspendReason, setUnsuspendReason] = useState('');

  const handleSuspendClick = (user) => {
    setUserToSuspend(user);
    setSuspendReason('');
    setSuspendDialogOpen(true);
  };

  const handleConfirmSuspend = async () => {
    if (!userToSuspend) return;
    try {
      await adminService.suspendUser(userToSuspend.id, suspendReason);
      toast.success("User suspended successfully");
      setSuspendDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  const handleUnsuspendClick = (user) => {
    setUserToUnsuspend(user);
    setUnsuspendReason('');
    setUnsuspendDialogOpen(true);
  };

  const handleConfirmUnsuspend = async () => {
    if (!userToUnsuspend) return;
    try {
      await adminService.unsuspendUser(userToUnsuspend.id, unsuspendReason);
      toast.success("User unsuspended successfully");
      setUnsuspendDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unsuspend user");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'reviewer': return 'warning';
      case 'researcher': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3, bgcolor: '#1A2E40', borderRadius: 2, minHeight: '80vh' }}>
      <Typography variant="h5" sx={{ mb: 3, color: '#64CCC5', fontWeight: 'bold' }}>
        Manage Users & Researchers
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: '#2B3E50' }}>
        <Table sx={{ minWidth: 650 }} aria-label="researchers table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#ccc' }}>Name</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Email</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Role</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Status</TableCell>
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
                    label={user.role || 'researcher'}
                    size="small"
                    color={getRoleColor(user.role)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? 'Active' : 'Suspended'}
                    size="small"
                    color={user.is_active ? 'success' : 'error'}
                    variant={user.is_active ? 'filled' : 'outlined'}
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
                    sx={{ color: '#64CCC5', borderColor: '#64CCC5', mr: 1, mb: 1, '&:hover': { bgcolor: 'rgba(100,204,197,0.1)' } }}
                    onClick={() => handleEditClick(user)}
                  >
                    Edit Role
                  </Button>
                  {user.is_active ? (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{ mr: 1, mb: 1 }}
                      onClick={() => handleSuspendClick(user)}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      color="success"
                      sx={{ mr: 1, mb: 1 }}
                      onClick={() => handleUnsuspendClick(user)}
                    >
                      Unsuspend
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ color: 'white', textAlign: 'center', py: 3 }}>
                  No users found
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

      {/* Suspend User Dialog */}
      <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)}>
        <DialogTitle>Suspend User: {userToSuspend?.name}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Are you sure you want to suspend this user? They will not be able to log in.
          </Typography>
          <TextField
            label="Reason for suspension"
            fullWidth
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="E.g. Violation of terms"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSuspend} variant="contained" color="error">Suspend</Button>
        </DialogActions>
      </Dialog>

      {/* Unsuspend User Dialog */}
      <Dialog open={unsuspendDialogOpen} onClose={() => setUnsuspendDialogOpen(false)}>
        <DialogTitle>Unsuspend User: {userToUnsuspend?.name}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to reactivate this user account?
          </Typography>
          <TextField
            label="Reason for reactivation"
            fullWidth
            value={unsuspendReason}
            onChange={(e) => setUnsuspendReason(e.target.value)}
            placeholder="E.g. Issue resolved"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnsuspendDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmUnsuspend} variant="contained" color="success">Unsuspend</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ManageResearchers;