using System.Security.Claims;
using Campus_Services_Portal.Data;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Security
{
    public class CurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CampusXDbContext _context;

        public CurrentUserService(
            IHttpContextAccessor httpContextAccessor,
            CampusXDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public int? GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var claim = user?.FindFirst(
                ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                return null;
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return null;
            }

            return userId;
        }

        public async Task<int?> GetCurrentStudentIdAsync()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return null;
            }

            return await _context.Students
                .Where(s => s.UserId == userId.Value)
                .Select(s => (int?)s.Id)
                .FirstOrDefaultAsync();
        }
    }
}