using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Campus_Services_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FeePaymentController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public FeePaymentController(
            CampusXDbContext context)
        {
            _context = context;
        }


        // =============================================
        // STUDENT - GET MY PAYMENTS
        // =============================================

        [HttpGet("my-payments")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult>
            GetMyPayments()
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                );

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new
                    {
                        message =
                            "Invalid token."
                    });
            }

            var userId =
                int.Parse(
                    userIdClaim.Value
                );

            var student =
                await _context.Students
                    .FirstOrDefaultAsync(
                        s => s.UserId == userId
                    );

            if (student == null)
            {
                return NotFound(
                    new
                    {
                        message =
                            "Student not found."
                    });
            }

            var payments =
                await _context.FeePayments
                    .Where(
                        fp =>
                            fp.StudentId ==
                            student.Id
                    )
                    .OrderByDescending(
                        fp => fp.Id
                    )
                    .Select(
                        fp => new
                        {
                            fp.Id,
                            fp.FeeType,
                            fp.Amount,

                            Status =
                                fp.Status.ToString(),

                            fp.PaidAt,
                            fp.ReceiptNumber
                        }
                    )
                    .ToListAsync();

            return Ok(payments);
        }


        // =============================================
        // STUDENT - MAKE PAYMENT
        // =============================================

        [HttpPost("pay")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult>
            PayFee(
                string feeType,
                decimal amount
            )
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                );

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new
                    {
                        message =
                            "Invalid token."
                    });
            }

            var userId =
                int.Parse(
                    userIdClaim.Value
                );

            var student =
                await _context.Students
                    .FirstOrDefaultAsync(
                        s => s.UserId == userId
                    );

            if (student == null)
            {
                return NotFound(
                    new
                    {
                        message =
                            "Student not found."
                    });
            }

            var alreadyPaid =
                await _context.FeePayments
                    .AnyAsync(
                        fp =>
                            fp.StudentId ==
                                student.Id &&
                            fp.FeeType ==
                                feeType &&
                            fp.Status ==
                                PaymentStatus.Paid
                    );

            if (alreadyPaid)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "This fee has already been paid."
                    });
            }

            if (amount <= 0)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Amount must be greater than zero."
                    });
            }

            var payment =
                new FeePayment
                {
                    StudentId =
                        student.Id,

                    FeeType =
                        feeType,

                    Amount =
                        amount,

                    Status =
                        PaymentStatus.Paid,

                    PaidAt =
                        DateTime.UtcNow,

                    ReceiptNumber =
                        $"RCPT-{DateTime.UtcNow:yyyyMMddHHmmss}-{student.Id}"
                };

            _context.FeePayments
                .Add(payment);

            await _context
                .SaveChangesAsync();

            return Ok(
                new
                {
                    message =
                        "Payment completed successfully.",

                    payment.Id,
                    payment.FeeType,
                    payment.Amount,

                    Status =
                        payment.Status.ToString(),

                    payment.PaidAt,
                    payment.ReceiptNumber
                });
        }


        // =============================================
        // ADMIN - GET ALL PAYMENTS
        // =============================================

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            GetAllPayments()
        {
            var payments =
                await _context.FeePayments
                    .Include(
                        fp => fp.Student
                    )
                    .OrderByDescending(
                        fp => fp.Id
                    )
                    .Select(
                        fp => new
                        {
                            fp.Id,

                            fp.StudentId,

                            StudentName =
                                fp.Student != null
                                    ? fp.Student.FullName
                                    : "Unknown Student",

                            IndexNumber =
                                fp.Student != null
                                    ? fp.Student.IndexNumber
                                    : "",

                            fp.FeeType,
                            fp.Amount,

                            Status =
                                fp.Status.ToString(),

                            fp.PaidAt,
                            fp.ReceiptNumber
                        }
                    )
                    .ToListAsync();

            return Ok(payments);
        }
    }
}