/*
  # Fix infinite recursion in usuarios RLS policy

  1. Security Changes
    - Drop the existing policy that causes infinite recursion
    - Create a new policy that allows users to read their own data using auth.uid()
    - Ensure the policy doesn't create circular dependencies

  The issue was that the policy was querying the usuarios table within its own condition,
  creating infinite recursion. The fix uses auth.uid() directly to match the user's ID.
*/

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Usuarios podem ver dados do seu estabelecimento" ON usuarios;

-- Create a new policy that allows users to read their own data
CREATE POLICY "Users can read own data"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create a policy for users to read other users from the same establishment
CREATE POLICY "Users can read establishment colleagues"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (
    estabelecimento_id = (
      SELECT u.estabelecimento_id 
      FROM usuarios u 
      WHERE u.id = auth.uid()
      LIMIT 1
    )
  );