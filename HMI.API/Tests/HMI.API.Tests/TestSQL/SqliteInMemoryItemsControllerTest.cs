using System;
using System.Data.Common;
using HMI.API.DataAccess.Contexts;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace HMI.API.Tests.TestSQL
{
    #region SqliteInMemory
    public class SqliteInMemoryItemsControllerTest : ItemsControllerTest, IDisposable
    {
        private readonly DbConnection _connection;

        public SqliteInMemoryItemsControllerTest()
            : base(
                new DbContextOptionsBuilder<ApplicationContext>()
                    .UseSqlite(CreateInMemoryDatabase())
                    .Options)
        {
            _connection = RelationalOptionsExtension.Extract(ContextOptions).Connection;
        }

        private static DbConnection CreateInMemoryDatabase()
        {
            var connection = new SqliteConnection("Filename=:memory:");

            connection.Open();

            return connection;
        }

        public void Dispose() => _connection.Dispose();
    }
    #endregion
}