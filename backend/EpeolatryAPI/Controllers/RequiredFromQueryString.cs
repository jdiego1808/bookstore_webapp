using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpeolatryAPI.Controllers
{
    public class RequiredFromQueryString : IActionConstraint
    {
        private readonly string _parameter;

        public RequiredFromQueryString(string parameter)
        {
            _parameter = parameter;
        }

        public int Order => 999;

        public bool Accept(ActionConstraintContext context)
        {
            if (!context.RouteContext.HttpContext.Request.Query.ContainsKey(_parameter)) return false;

            return true;
        }
    }

    public class RequiredFromQueryAttribute : FromQueryAttribute, IParameterModelConvention
    {
        public void Apply(ParameterModel parameter)
        {
            if (parameter.Action.Selectors != null && parameter.Action.Selectors.Any())
                parameter.Action.Selectors.Last().ActionConstraints.Add(
                    new RequiredFromQueryString(parameter.BindingInfo?.BinderModelName ?? parameter.ParameterName));
        }
    }
}
