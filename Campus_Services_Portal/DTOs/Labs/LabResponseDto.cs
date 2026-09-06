namespace Campus_Services_Portal.DTOs.Labs
{
    public class LabResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public bool IsActive { get; set; }
    }
}