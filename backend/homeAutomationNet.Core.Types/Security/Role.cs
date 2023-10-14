using homeAutomationNet.Core.Types.Entity;

namespace homeAutomationNet.Core.Types.Security
{
    public class Role : IEntity, INamed
    {
        public string Name { get; set; }
    }
}
