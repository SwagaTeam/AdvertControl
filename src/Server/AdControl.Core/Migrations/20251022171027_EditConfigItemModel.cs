using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdControl.Core.Migrations
{
    /// <inheritdoc />
    public partial class EditConfigItemModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlOrData",
                table: "ConfigItems");

            migrationBuilder.AddColumn<string>(
                name: "InlineData",
                table: "ConfigItems",
                type: "character varying(5000)",
                maxLength: 5000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "ConfigItems",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InlineData",
                table: "ConfigItems");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "ConfigItems");

            migrationBuilder.AddColumn<string>(
                name: "UrlOrData",
                table: "ConfigItems",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");
        }
    }
}
