namespace Campus_Services_Portal.DTOs.Auth
{
    public class RegisterStudentDto
    {
        public string IndexNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Faculty { get; set; } = string.Empty;

        public string ContactNumber { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }
}
