// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation
export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

// Salary validation
export const isValidSalary = (salary) => {
  return !isNaN(salary) && salary > 0;
};

// Date validation
export const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

// Role validation
export const isValidRole = (role) => {
  const validRoles = ['Inventory Manager', 'User Manager'];
  return validRoles.includes(role);
};

// Status validation
export const isValidStatus = (status) => {
  const validStatuses = ['Present', 'Absent', 'Leave'];
  return validStatuses.includes(status);
};
