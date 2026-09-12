namespace Campus_Services_Portal.DTOs.Labs
{
    public class AvailableSlotDto
    {
        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int BookedCount { get; set; }

        public int Capacity { get; set; }

        public int RemainingCapacity { get; set; }

        public bool IsAvailable { get; set; }
    }
}