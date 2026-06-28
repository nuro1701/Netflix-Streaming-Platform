const authService = require('../services/token'); // Import the authentication service

/**
 * Handles user login.
 * - Verifies email and password provided by the user.
 * - Returns a JWT token and user details if authentication succeeds.
 * - Handles various error cases like missing inputs or invalid credentials.
 */
async function login(req, res) {
  try {
    // Destructure email and password from the request body
    const { mail, password } = req.body;

    // Validate that both email and password are provided
    if (!mail || !password) {
      return res.status(400).json({ message: 'Email and password are required.' }); // 400 Bad Request
    }

    // Retrieve the user by email using the authentication service
    const user = await authService.getUserByMail(mail);

    // Check if user exists and if the provided password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' }); // 401 Unauthorized
    }

    // Generate a JWT token for the authenticated user
    const token = authService.generateToken(user.mail);
    console.log(token);

    // Return success response with token and user details
    return res.status(200).json({
      message: 'Login successful.',
      token: token,
      user: {
        _id: user._id,
        mail: user.mail,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin 
      },
    });
  } catch (error) {
    // Log unexpected errors for debugging purposes
    console.error('Error during login:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}

module.exports = { login };
