import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navigation() {
  const { user, hasAccess } = useAuth();

  return (
    <nav>
      {/* Always visible for authenticated users */}
      <Link to="/production">Production</Link>
      <Link to="/consumption">Consumption</Link>

      {/* Only visible for strip_admin and admin */}
      {hasAccess(['strip_admin', 'admin']) && (
        <>
          <Link to="/reports">Reports</Link>
          <Link to="/allocation">Allocation</Link>
        </>
      )}
    </nav>
  );
}

export default Navigation; 