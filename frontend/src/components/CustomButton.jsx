import React from 'react';
import Button from '@mui/material/Button';

export const CustomButton = ({ label, onClick, className }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    className={className}
  >
    {label}
  </Button>
);
