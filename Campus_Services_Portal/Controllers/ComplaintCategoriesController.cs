using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/complaint-categories")]
    public class ComplaintCategoriesController : ControllerBase
    {
        private readonly IComplaintCategoryService _service;

        public ComplaintCategoriesController(
            IComplaintCategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _service.GetAllAsync();

            return Ok(categories);
        }
    }
}