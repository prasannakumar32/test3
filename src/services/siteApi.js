import { verifyUserAndGetSites, getUserSites, hasAccessToSite } from '../data/userSites';

// Authenticate user and get their sites
export const authenticateAndGetSites = async (userid, password) => {
  try {
    const result = verifyUserAndGetSites(userid, password);
    if (result.authenticated) {
      return {
        success: true,
        data: result
      };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get sites for authenticated user
export const getSitesForUser = async (userid) => {
  try {
    const sites = getUserSites(userid);
    if (sites.length > 0) {
      return {
        success: true,
        data: sites
      };
    } else {
      throw new Error('No sites found for user');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify site access for user
export const verifySiteAccess = async (userid, site) => {
  try {
    const hasAccess = hasAccessToSite(userid, site);
    return {
      success: true,
      data: {
        hasAccess,
        site
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
