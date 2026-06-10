using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace AchikiLauncher
{
    internal static class Program
    {
        private const string Url = "http://localhost:3000";

        [STAThread]
        private static void Main()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string script = Path.Combine(baseDir, "INICIAR_ACHIKI.bat");

            if (!File.Exists(script))
            {
                script = Path.Combine(baseDir, "ACHIKI", "INICIAR_ACHIKI.bat");
            }

            if (!File.Exists(script))
            {
                MessageBox.Show(
                    "No encontre INICIAR_ACHIKI.bat. Pon ACHIKI.exe dentro de la carpeta ACHIKI o junto a la carpeta ACHIKI.",
                    "ACHIKI",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning
                );
                return;
            }

            string workingDirectory = Path.GetDirectoryName(script);

            if (!IsServerReady())
            {
                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/k \"title ACHIKI && call \"" + script + "\"\"",
                    WorkingDirectory = workingDirectory,
                    UseShellExecute = true
                };

                Process.Start(startInfo);
            }

            for (int i = 0; i < 120; i++)
            {
                if (IsServerReady())
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = Url,
                        UseShellExecute = true
                    });
                    return;
                }

                Thread.Sleep(1000);
            }

            MessageBox.Show(
                "ACHIKI esta iniciando, pero no pude confirmar la pagina. Revisa la ventana de terminal y abre http://localhost:3000 cuando diga Ready.",
                "ACHIKI",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }

        private static bool IsServerReady()
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
                request.Method = "GET";
                request.Timeout = 2000;
                request.ReadWriteTimeout = 2000;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    int statusCode = (int)response.StatusCode;
                    return statusCode >= 200 && statusCode < 500;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
