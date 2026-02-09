-- Add delete policies for admin to reset data
CREATE POLICY "Admins can delete responses"
ON public.valentine_responses
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete status"
ON public.valentine_status
FOR DELETE
TO authenticated
USING (true);