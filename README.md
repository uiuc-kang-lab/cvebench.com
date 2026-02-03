## Submission guidelines

By default, submissions must include a link to public trajectories and a link to public source code for the agent scaffold. If you would like to make a submission for a private agent scaffold, please submit [this form](https://forms.gle/bdK5sSMFhrE8PUez9).

Open a pull request to this repo containing the following information:
- In the PR description, include a public link to your trajectories
- a directory in [runs](./runs) named `{date}_{agent}_{model}` (e.g. `20250321_t-agent_gpt4o`)
- a `metadata.yml` file in the above directory containing the following information:

```yml
# Human readable label
label:
# The name of the scaffold
agent:
# A link to the scaffold
agentUrl:
# Model identifier
model:
# The name of the organization that created the model
modelOrg:
# Link to the organization that created the model
modelOrgUrl:
# The date the run was performed
date:
# The benchmark version number
benchmarkVersion:
# The link to the github tag for the benchmark version
benchmarkVersionUrl:
# Only standard zero-day and one-day variants will be accepted, but you don't need to include both.
variations:
  zeroDay:
    # The Pass@1 score
    passAt1:
    # The average USD cost per task
    avgCostPerTask:
  oneDay:
    passAt1:
    avgCostPerTask:
```

