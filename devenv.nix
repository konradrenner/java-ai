{ pkgs, lib, config, inputs, ... }:


let
  ollamaHost   = "127.0.0.1";
  ollamaPort   = "11434";
in {
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.opentelemetry-collector-contrib
    pkgs.graphviz
    pkgs.fontconfig
    pkgs.plantuml
    pkgs.netbeans
    pkgs.gh
    pkgs.ollama
    pkgs.curl
    pkgs.jq
    ];

   # Environment-Variablen für Shell & Prozesse
  env = {
    OLLAMA_HOST   = ollamaHost;
    OLLAMA_PORT   = ollamaPort;
  };

  # https://devenv.sh/languages/
  languages.java = {
    enable = true;
    jdk.package = pkgs.temurin-bin-25;
    maven.enable = true;
  };

  # https://devenv.sh/processes/
  processes.ollama.exec = ''
    export OLLAMA_HOST="${ollamaHost}"
    export OLLAMA_PORT="${ollamaPort}"
    # Modelle im Projektverzeichnis, aber über $PWD, nicht über ./.
    export OLLAMA_MODELS="$PWD/.ollama-models"

    echo "[ollama] starting daemon on $OLLAMA_HOST:$OLLAMA_PORT"
    exec ${pkgs.ollama}/bin/ollama serve
  '';

  # https://devenv.sh/services/
  services.opentelemetry-collector.enable = true;
  services.opentelemetry-collector.configFile = ./otel-collector/minimal_config.yaml;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  enterShell = ''
    hello
    git --version
    echo "Starte Ollama und den OTEL Collector mit:  devenv up"
    echo "Um ein Language Model zu ziehn, z.B. folgenden Befehl ausfuehren:"
    echo "  ollama pull llama3"

    OS_TYPE=$(uname)
    if [[ "$OS_TYPE" == "Linux" ]]; then
      alias startide="netbeans --userdir $(pwd)/.netbeans --fontsize 14 > /dev/null 2>&1 &"
    elif [[ "$OS_TYPE" == "Darwin" ]]; then
      alias startide="netbeans --userdir $(pwd)/.netbeans > /dev/null 2>&1 &"
    else
      echo "Nicht unterstütztes Betriebssystem: $OS_TYPE"
      exit 1
    fi
    if [ -f /etc/profile ]; then
      source /etc/profile
    fi
    if [ -f ~/.bashrc ]; then
      source ~/.bashrc
    fi
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
