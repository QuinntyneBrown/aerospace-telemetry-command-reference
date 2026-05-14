using Ninja.Application.Common.Abstractions;
using Ninja.Application.Common.Errors;
using Ninja.Domain.Entities;
using Ninja.Domain.ValueObjects;

namespace Ninja.Application.Common;

internal static class ApplicationLookupExtensions
{
    public static Result<Tenant> FindTenant(this IApplicationDbContext dbContext, string tenantSlug)
    {
        var slug = TenantSlug.Create(tenantSlug);
        var tenant = dbContext.Tenants.FirstOrDefault(candidate => candidate.Slug == slug);

        return tenant is null
            ? Result<Tenant>.Failure(ApplicationError.NotFound("tenant.not_found", $"Tenant '{tenantSlug}' was not found."))
            : Result<Tenant>.Success(tenant);
    }

    public static Result<Machine> FindMachine(this IApplicationDbContext dbContext, Tenant tenant, Guid machineId)
    {
        var id = new MachineId(machineId);
        var machine = dbContext.Machines.FirstOrDefault(candidate => candidate.TenantId == tenant.Id && candidate.Id == id);

        return machine is null
            ? Result<Machine>.Failure(ApplicationError.NotFound("machine.not_found", $"Machine '{machineId}' was not found."))
            : Result<Machine>.Success(machine);
    }
}
