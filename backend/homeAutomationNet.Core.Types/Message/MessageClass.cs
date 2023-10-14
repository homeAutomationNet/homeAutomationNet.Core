using homeAutomationNet.Core.Types.Entity;

namespace homeAutomationNet.Core.Types.Message
{
    public class MessageClass : IEntity, INamed
    {
        public string Name { get; set; }
    }
}
