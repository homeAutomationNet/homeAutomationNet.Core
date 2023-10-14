using Migrator.Framework;
using System.Data;

namespace homeAutomationNet.Migrations
{
    [Migration(1)]
    public class Migration0001_CreateInitialdatabase : Migration
    {

        public override void Up()
        {
            Database.AddTable("Common_Security_Rights", 
                new Column("Id", DbType.Guid, ColumnProperty.NotNull | ColumnProperty.PrimaryKeyNonClustered | ColumnProperty.Unsigned),
                new Column("Name", DbType.String, 512, ColumnProperty.NotNull | ColumnProperty.Unique), 
                new Column("Description", DbType.String, 255, ColumnProperty.Null), 
                new Column("IsSystemRole", DbType.Boolean, ColumnProperty.NotNull, false),
                new Column("IsCustomerRole", DbType.Boolean, ColumnProperty.Null, false));

            Database.AddTable("Common_Security_Users", new Column("Id", DbType.Guid, ColumnProperty.NotNull), new Column("Name", DbType.String, 512, ColumnProperty.NotNull | ColumnProperty.PrimaryKey | ColumnProperty.Unsigned), new Column("Password", DbType.String, 64, ColumnProperty.NotNull, ""), new Column("FriendlyName", DbType.String, 50, ColumnProperty.Null), new Column("EMail", DbType.String, 50, ColumnProperty.Null), new Column("IsActive", DbType.Boolean, ColumnProperty.Null), new Column("IsLocked", DbType.Boolean, ColumnProperty.Null), new Column("LanguageID", DbType.String, 12, ColumnProperty.Null), new Column("ExpiryDate", DbType.DateTime, ColumnProperty.Null), new Column("IdleTimeout", DbType.Int64, 19, ColumnProperty.Null), new Column("LogoffAfterEachAction", DbType.Boolean, ColumnProperty.NotNull, false), new Column("CreatedTimeStamp", DbType.DateTime, ColumnProperty.NotNull), new Column("ModifiedTimeStamp", DbType.DateTime, ColumnProperty.NotNull), new Column("CanLogonOnlyOnce", DbType.Boolean, ColumnProperty.NotNull, false), new Column("ImageName", DbType.String, 255, ColumnProperty.Null), new Column("Archive", DbType.Int64, 19, ColumnProperty.NotNull | ColumnProperty.PrimaryKey | ColumnProperty.Unsigned, "0"), new Column("MaxWrongLoginsCount", DbType.Int64, 19, ColumnProperty.NotNull, "0"), new Column("CurrentWrongLoginsCount", DbType.Int64, 19, ColumnProperty.NotNull, "0"), new Column("PasswordExpiryDate", DbType.DateTime, ColumnProperty.Null), new Column("PasswordValidityTicks", DbType.Int64, 19, ColumnProperty.Null), new Column("PasswordStrengthRegex", DbType.String, 255, ColumnProperty.Null), new Column("PasswordReuseBlockedCount", DbType.Int64, 19, ColumnProperty.Null, "0"), new Column("PasswordLastSet", DbType.DateTime, ColumnProperty.Null), new Column("TransponderId", DbType.String, 50, ColumnProperty.Null), new Column("ApiKey", DbType.Guid, ColumnProperty.Null), new Column("PasswordHashType", DbType.Int32, 10, ColumnProperty.NotNull, "0"));
        }

        public override void Down() { }
    }
}