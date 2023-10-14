using homeAutomationNet.Core.Types.Entity;

namespace homeAutomationNet.Core.Types.Security
{
    public class User: IEntity, INamed
    {
        public string Name { get; set; }
    }
}
