using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace homeAutomationNet.Core.Types.Data
{
    public class Signal
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public SignalDataType DataType { get; set; }
    }
}
